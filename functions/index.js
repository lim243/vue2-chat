const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");

const ALGOLIA_APP_ID = "NDWYJLN734";
const ALGOLIA_ADMIN_KEY = "2c0f408ce3d48cb1d6874f201ba6783c";
const ALGOLIA_INDEX_NAME = "users";

admin.initializeApp(functions.config().firebase);

exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res) => {
  var arr = [];

  admin
    .firestore()
    .collection("users")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        let user = doc.data();
        user.objectID = doc.id;

        arr.push(user);
      });

      var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
      var index = client.initIndex(ALGOLIA_INDEX_NAME);

      index
        .saveObjects(arr)
        .then(({ objectIDs }) => {
          console.log(objectIDs);
        })
        .catch((err) => {
          console.log(err);
        });
    });
});
