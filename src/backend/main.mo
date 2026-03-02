import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import List "mo:core/List";
import Text "mo:core/Text";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Persistent types
  type Category = {
    id : Nat;
    name : Text;
    description : Text;
    displayOrder : Nat;
    coverImage : Text;
  };

  type Design = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    price : Text;
    videoUrl : Text;
  };

  type CustomerSelection = {
    id : Nat;
    designId : Nat;
    designName : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    brideGroomNames : Text;
    eventDate : Text;
    message : Text;
    submittedAt : Int;
  };

  type SiteSettings = {
    tagline : Text;
    contactEmail : Text;
    contactPhone : Text;
    whatsappLink : Text;
    facebookLink : Text;
    instagramLink : Text;
    twitterLink : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // In-memory storage
  let categories = Map.empty<Nat, Category>();
  let designs = Map.empty<Nat, Design>();
  let customerSelections = Map.empty<Nat, CustomerSelection>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextCategoryId = 1;
  var nextDesignId = 1;
  var nextSelectionId = 1;

  var siteSettings : SiteSettings = {
    tagline = "Timeless Digital Invitations for Moments That Last Forever.";
    contactEmail = "";
    contactPhone = "";
    whatsappLink = "";
    facebookLink = "";
    instagramLink = "";
    twitterLink = "";
  };

  // Compare function for sorting categories
  func compareCategories(a : Category, b : Category) : { #less; #equal; #greater } {
    Nat.compare(a.displayOrder, b.displayOrder);
  };

  // ************ Admin Authentication Types ************
  type AdminCredentials = {
    email : Text;
    passwordHash : Text;
    otpCode : Text;
    otpExpiry : Int;
  };

  type AdminSession = {
    token : Text;
    expiry : Int;
  };

  var adminCredentials : ?AdminCredentials = null;
  var adminSession : ?AdminSession = null;

  // ************ Helper Functions ************

  // Generate a 6-digit OTP
  func generateOtp() : Text {
    let otpNumber = Int.abs(Time.now() % 1_000_000);
    let otpText = otpNumber.toText();
    let concatenated = otpText # "00000";
    let chars = concatenated.toArray();
    let sliced = chars.sliceToArray(0, 6);
    Text.fromArray(sliced);
  };

  // Generate session token
  func generateSessionToken(email : Text) : Text {
    let timestamp = Int.abs(Time.now());
    let random = Int.abs(Time.now() % 999999);
    "sess_" # email # "_" # timestamp.toText() # "_" # random.toText();
  };

  // Verify session token (non-async helper)
  func isValidSession(token : Text) : Bool {
    switch (adminSession) {
      case (null) { false };
      case (?session) {
        session.token == token and Time.now() < session.expiry;
      };
    };
  };

  // ************ Admin Authentication Functions ************

  public query func isAdminSetup() : async Bool {
    adminCredentials != null;
  };

  public shared ({ caller }) func adminSignup(email : Text, passwordHash : Text) : async Bool {
    // Anyone can call this, but only works if no admin exists
    switch (adminCredentials) {
      case (?_) { Runtime.trap("Admin already set up") };
      case (null) {
        adminCredentials := ?{
          email;
          passwordHash;
          otpCode = "";
          otpExpiry = 0;
        };
        true;
      };
    };
  };

  public shared ({ caller }) func requestAdminOtp(email : Text, passwordHash : Text) : async Text {
    // Anyone can call this for login purposes
    switch (adminCredentials) {
      case (null) { Runtime.trap("Admin not set up") };
      case (?creds) {
        if (creds.email != email or creds.passwordHash != passwordHash) {
          Runtime.trap("Invalid credentials");
        };
        let otpCode = generateOtp();
        let newCreds = {
          creds with
          otpCode;
          otpExpiry = Time.now() + (5 * 60 * 1_000_000_000); // 5 minutes
        };
        adminCredentials := ?newCreds;
        otpCode;
      };
    };
  };

  public shared ({ caller }) func verifyAdminOtp(email : Text, otp : Text) : async Text {
    // Anyone can call this for login purposes
    switch (adminCredentials) {
      case (null) { Runtime.trap("Admin not set up") };
      case (?creds) {
        if (creds.email != email) {
          Runtime.trap("Invalid email");
        };
        if (Time.now() > creds.otpExpiry) {
          Runtime.trap("OTP expired");
        };
        if (creds.otpCode != otp) {
          Runtime.trap("Invalid OTP");
        };

        // Clear OTP and create session
        adminCredentials := ?{
          creds with
          otpCode = "";
          otpExpiry = 0;
        };

        let sessionToken = generateSessionToken(email);
        adminSession := ?{
          token = sessionToken;
          expiry = Time.now() + (24 * 60 * 60 * 1_000_000_000); // 24 hours
        };
        sessionToken;
      };
    };
  };

  public query func verifyAdminSession(token : Text) : async Bool {
    // Anyone can verify a token they possess
    isValidSession(token);
  };

  public shared ({ caller }) func adminLogout(token : Text) : async () {
    // Anyone can logout their own session
    switch (adminSession) {
      case (null) { Runtime.trap("No active session") };
      case (?session) {
        if (session.token != token) {
          Runtime.trap("Invalid token");
        };
        adminSession := null;
      };
    };
  };

  public shared ({ caller }) func changeAdminPassword(sessionToken : Text, newPasswordHash : Text) : async () {
    // Must have valid session to change password
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    switch (adminCredentials) {
      case (null) { Runtime.trap("Admin credentials not found") };
      case (?creds) {
        adminCredentials := ?{
          creds with
          passwordHash = newPasswordHash;
          otpCode = "";
          otpExpiry = 0;
        };
      };
    };
  };

  // ************ Session-Based Category CRUD ************

  public shared ({ caller }) func createCategoryWithSession(sessionToken : Text, name : Text, description : Text, displayOrder : Nat, coverImage : Text) : async Category {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    let category : Category = {
      id = nextCategoryId;
      name;
      description;
      displayOrder;
      coverImage;
    };
    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category;
  };

  public shared ({ caller }) func updateCategoryWithSession(sessionToken : Text, id : Nat, name : Text, description : Text, displayOrder : Nat, coverImage : Text) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (_) {
        let updated : Category = {
          id;
          name;
          description;
          displayOrder;
          coverImage;
        };
        categories.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCategoryWithSession(sessionToken : Text, id : Nat) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };
    categories.remove(id);
  };

  // ************ Session-Based Design CRUD ************

  public shared ({ caller }) func createDesignWithSession(sessionToken : Text, categoryId : Nat, name : Text, description : Text, price : Text, videoUrl : Text) : async Design {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category does not exist");
    };
    let design : Design = {
      id = nextDesignId;
      categoryId;
      name;
      description;
      price;
      videoUrl;
    };
    designs.add(nextDesignId, design);
    nextDesignId += 1;
    design;
  };

  public shared ({ caller }) func updateDesignWithSession(sessionToken : Text, id : Nat, categoryId : Nat, name : Text, description : Text, price : Text, videoUrl : Text) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    switch (designs.get(id)) {
      case (null) { Runtime.trap("Design not found") };
      case (_) {
        let updated : Design = {
          id;
          categoryId;
          name;
          description;
          price;
          videoUrl;
        };
        designs.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteDesignWithSession(sessionToken : Text, id : Nat) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    if (not designs.containsKey(id)) {
      Runtime.trap("Design not found");
    };
    designs.remove(id);
  };

  // ************ Session-Based Customer Selections ************

  public shared ({ caller }) func listSelectionsWithSession(sessionToken : Text) : async [CustomerSelection] {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    customerSelections.values().toArray();
  };

  // ************ Session-Based Site Settings ************

  public shared ({ caller }) func updateSiteSettingsWithSession(
    sessionToken : Text,
    tagline : Text,
    contactEmail : Text,
    contactPhone : Text,
    whatsappLink : Text,
    facebookLink : Text,
    instagramLink : Text,
    twitterLink : Text,
  ) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };
    siteSettings := {
      tagline;
      contactEmail;
      contactPhone;
      whatsappLink;
      facebookLink;
      instagramLink;
      twitterLink;
    };
  };

  // ************ Session-Based Initialization ************

  public shared ({ caller }) func initializeSeedData(sessionToken : Text) : async () {
    if (not isValidSession(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session");
    };

    // Seed categories
    let categoryNamesList = List.fromArray(["Wedding Invitations", "Engagement Invitations", "Birthday Invitations", "Baby Shower Invitations", "Anniversary Invitations", "Corporate Events", "Other Events"]);
    for (name in categoryNamesList.values()) {
      let categoryObj : Category = {
        id = nextCategoryId;
        name;
        description = "";
        displayOrder = nextCategoryId;
        coverImage = "";
      };
      categories.add(nextCategoryId, categoryObj);

      // Seed 2 designs per category
      let design1 : Design = {
        id = nextDesignId;
        categoryId = nextCategoryId;
        name = "Sample Design $49 for " # name;
        description = "Beautiful design template";
        price = "$49";
        videoUrl = "";
      };
      designs.add(nextDesignId, design1);
      nextDesignId += 1;

      let design2 : Design = {
        id = nextDesignId;
        categoryId = nextCategoryId;
        name = "Sample Design $79 for " # name;
        description = "Premium design template";
        price = "$79";
        videoUrl = "";
      };
      designs.add(nextDesignId, design2);
      nextDesignId += 1;

      nextCategoryId += 1;
    };
  };

  // ************ User Profile Functions ************

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ************ Category CRUD ************

  public shared ({ caller }) func createCategory(name : Text, description : Text, displayOrder : Nat, coverImage : Text) : async Category {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    let category : Category = {
      id = nextCategoryId;
      name;
      description;
      displayOrder;
      coverImage;
    };
    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category;
  };

  public shared ({ caller }) func updateCategory(id : Nat, name : Text, description : Text, displayOrder : Nat, coverImage : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (_) {
        let updated : Category = {
          id;
          name;
          description;
          displayOrder;
          coverImage;
        };
        categories.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };
    categories.remove(id);
  };

  public query func getCategory(id : Nat) : async ?Category {
    categories.get(id);
  };

  public query func listCategories() : async [Category] {
    categories.values().toArray().sort(compareCategories);
  };

  // ************ Design CRUD ************

  public shared ({ caller }) func createDesign(categoryId : Nat, name : Text, description : Text, price : Text, videoUrl : Text) : async Design {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create designs");
    };
    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category does not exist");
    };
    let design : Design = {
      id = nextDesignId;
      categoryId;
      name;
      description;
      price;
      videoUrl;
    };
    designs.add(nextDesignId, design);
    nextDesignId += 1;
    design;
  };

  public shared ({ caller }) func updateDesign(id : Nat, categoryId : Nat, name : Text, description : Text, price : Text, videoUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update designs");
    };
    switch (designs.get(id)) {
      case (null) { Runtime.trap("Design not found") };
      case (_) {
        let updated : Design = {
          id;
          categoryId;
          name;
          description;
          price;
          videoUrl;
        };
        designs.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteDesign(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete designs");
    };
    if (not designs.containsKey(id)) {
      Runtime.trap("Design not found");
    };
    designs.remove(id);
  };

  public query func getDesign(id : Nat) : async ?Design {
    designs.get(id);
  };

  public query func listDesigns() : async [Design] {
    designs.values().toArray();
  };

  public query func listDesignsByCategory(categoryId : Nat) : async [Design] {
    designs.values().toArray().filter(func(d : Design) : Bool { d.categoryId == categoryId });
  };

  // ************ Customer Selections ************

  public shared func createSelection(
    designId : Nat,
    designName : Text,
    customerName : Text,
    email : Text,
    phone : Text,
    brideGroomNames : Text,
    eventDate : Text,
    message : Text,
  ) : async CustomerSelection {
    if (not designs.containsKey(designId)) {
      Runtime.trap("Design does not exist");
    };
    let selection : CustomerSelection = {
      id = nextSelectionId;
      designId;
      designName;
      customerName;
      email;
      phone;
      brideGroomNames;
      eventDate;
      message;
      submittedAt = Time.now();
    };
    customerSelections.add(nextSelectionId, selection);
    nextSelectionId += 1;
    selection;
  };

  public query ({ caller }) func listSelections() : async [CustomerSelection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all selections");
    };
    customerSelections.values().toArray();
  };

  // ************ Site Settings ************

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(
    tagline : Text,
    contactEmail : Text,
    contactPhone : Text,
    whatsappLink : Text,
    facebookLink : Text,
    instagramLink : Text,
    twitterLink : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };
    siteSettings := {
      tagline;
      contactEmail;
      contactPhone;
      whatsappLink;
      facebookLink;
      instagramLink;
      twitterLink;
    };
  };

  // ************ Initialization ************

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };

    // Seed categories
    let categoryNames = ["Wedding Invitations", "Engagement Invitations", "Birthday Invitations", "Baby Shower Invitations", "Anniversary Invitations", "Corporate Events", "Other Events"];

    for (name in categoryNames.vals()) {
      let categoryObj : Category = {
        id = nextCategoryId;
        name = name;
        description = "";
        displayOrder = nextCategoryId;
        coverImage = "";
      };
      categories.add(nextCategoryId, categoryObj);

      // Seed 2 designs per category
      let design1 : Design = {
        id = nextDesignId;
        categoryId = nextCategoryId;
        name = "Sample Design $49 for " # name;
        description = "Beautiful design template";
        price = "$49";
        videoUrl = "";
      };
      designs.add(nextDesignId, design1);
      nextDesignId += 1;

      let design2 : Design = {
        id = nextDesignId;
        categoryId = nextCategoryId;
        name = "Sample Design $79 for " # name;
        description = "Premium design template";
        price = "$79";
        videoUrl = "";
      };
      designs.add(nextDesignId, design2);
      nextDesignId += 1;

      nextCategoryId += 1;
    };
  };
};
