package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

// Auto generated migration with the most recent collections configuration.
func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
		  {
		    "id": "systemprofiles0",
		    "name": "profiles",
		    "system": true,
		    "listRule": "userId = @request.user.id",
		    "viewRule": "userId = @request.user.id",
		    "createRule": "userId = @request.user.id",
		    "updateRule": "userId = @request.user.id",
		    "deleteRule": null,
		    "schema": [
		      {
		        "id": "pbfielduser",
		        "name": "userId",
		        "type": "user",
		        "system": true,
		        "required": true,
		        "unique": true,
		        "options": {
		          "maxSelect": 1,
		          "cascadeDelete": true
		        }
		      },
		      {
		        "id": "pbfieldname",
		        "name": "name",
		        "type": "text",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      },
		      {
		        "id": "pbfieldavatar",
		        "name": "avatar",
		        "type": "file",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "maxSelect": 1,
		          "maxSize": 5242880,
		          "mimeTypes": [
		            "image/jpg",
		            "image/jpeg",
		            "image/png",
		            "image/svg+xml",
		            "image/gif"
		          ],
		          "thumbs": null
		        }
		      },
		      {
		        "id": "t7xqlpxv",
		        "name": "notes",
		        "type": "text",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      }
		    ]
		  },
		  {
		    "id": "vxz2gzk26a3tgjd",
		    "name": "booking",
		    "system": false,
		    "listRule": null,
		    "viewRule": null,
		    "createRule": null,
		    "updateRule": null,
		    "deleteRule": null,
		    "schema": [
		      {
		        "id": "gpwevg4x",
		        "name": "by",
		        "type": "user",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "maxSelect": 1,
		          "cascadeDelete": false
		        }
		      },
		      {
		        "id": "tnwpevwq",
		        "name": "type",
		        "type": "select",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "maxSelect": 1,
		          "values": ["visit", "booth", "meeting"]
		        }
		      },
		      {
		        "id": "vqlrlm0q",
		        "name": "at",
		        "type": "date",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "min": "",
		          "max": ""
		        }
		      },
		      {
		        "id": "oiojhyts",
		        "name": "until",
		        "type": "date",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "min": "",
		          "max": ""
		        }
		      }
		    ]
		  },
		  {
		    "id": "ntuuq9ktswwjxse",
		    "name": "stripe",
		    "system": false,
		    "listRule": null,
		    "viewRule": null,
		    "createRule": null,
		    "updateRule": null,
		    "deleteRule": null,
		    "schema": [
		      {
		        "id": "oax4jaab",
		        "name": "is",
		        "type": "user",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "maxSelect": 1,
		          "cascadeDelete": false
		        }
		      },
		      {
		        "id": "kkhwkwsi",
		        "name": "name",
		        "type": "text",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      },
		      {
		        "id": "f9hzyiy1",
		        "name": "email",
		        "type": "email",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "exceptDomains": [],
		          "onlyDomains": []
		        }
		      },
		      {
		        "id": "xwx57baj",
		        "name": "amount",
		        "type": "number",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "min": 0,
		          "max": null
		        }
		      },
		      {
		        "id": "h62mmxca",
		        "name": "charge_id",
		        "type": "text",
		        "system": false,
		        "required": true,
		        "unique": true,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      },
		      {
		        "id": "sl3yjflz",
		        "name": "disputed",
		        "type": "bool",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {}
		      },
		      {
		        "id": "n77v4hzq",
		        "name": "refunded",
		        "type": "bool",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {}
		      }
		    ]
		  },
		  {
		    "id": "csot93jnuofgw27",
		    "name": "croissant",
		    "system": false,
		    "listRule": null,
		    "viewRule": null,
		    "createRule": null,
		    "updateRule": null,
		    "deleteRule": null,
		    "schema": [
		      {
		        "id": "zkmqbcaa",
		        "name": "is",
		        "type": "user",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "maxSelect": 1,
		          "cascadeDelete": false
		        }
		      },
		      {
		        "id": "f3leznuw",
		        "name": "name",
		        "type": "text",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      },
		      {
		        "id": "k9gphizj",
		        "name": "at",
		        "type": "date",
		        "system": false,
		        "required": true,
		        "unique": false,
		        "options": {
		          "min": "",
		          "max": ""
		        }
		      },
		      {
		        "id": "7ggehou1",
		        "name": "until",
		        "type": "date",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": "",
		          "max": ""
		        }
		      },
		      {
		        "id": "jemf5svq",
		        "name": "image",
		        "type": "url",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "exceptDomains": null,
		          "onlyDomains": null
		        }
		      },
		      {
		        "id": "o6lz0qmq",
		        "name": "visit_id",
		        "type": "text",
		        "system": false,
		        "required": true,
		        "unique": true,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      },
		      {
		        "id": "foqmiib8",
		        "name": "croissant_id",
		        "type": "text",
		        "system": false,
		        "required": false,
		        "unique": false,
		        "options": {
		          "min": null,
		          "max": null,
		          "pattern": ""
		        }
		      }
		    ]
		  }
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		// no revert since the configuration on the environment, on which
		// the migration was executed, could have changed via the UI/API
		return nil
	})
}
