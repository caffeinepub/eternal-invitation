import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  type OldCategory = {
    id : Nat;
    name : Text;
    description : Text;
    displayOrder : Nat;
    coverImage : Text;
  };

  // Old actor type (matches old actor structure)
  type OldActor = {
    categories : Map.Map<Nat, OldCategory>;
  };

  type NewCategory = {
    id : Nat;
    name : Text;
    description : Text;
    displayOrder : Nat;
    coverImage : Text;
  };

  // New actor type (matches new actor structure)
  type NewActor = {
    categories : Map.Map<Nat, NewCategory>;
    adminCredentials : ?{
      email : Text;
      passwordHash : Text;
      otpCode : Text;
      otpExpiry : Int;
    };
    adminSession : ?{
      token : Text;
      expiry : Int;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newCategories = old.categories.map<Nat, OldCategory, NewCategory>(
      func(_id, oldCategory) {
        {
          id = oldCategory.id;
          name = oldCategory.name;
          description = oldCategory.description;
          displayOrder = oldCategory.displayOrder;
          coverImage = oldCategory.coverImage;
        };
      }
    );
    {
      categories = newCategories;
      adminCredentials = null;
      adminSession = null;
    };
  };
};
