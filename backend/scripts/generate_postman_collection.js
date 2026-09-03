const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    _postman_id: "57886560-9b0e6b12-83b6-4352-8eb6-ca3ba35c120e",
    name: "Inkviz API",
    description: "Official, production-grade Postman Collection for Inkviz SaaS Invoice Generator running on port 5001. Compliant with Postman Collection Schema v2.1.0.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{accessToken}}",
        type: "string"
      }
    ]
  },
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:5001",
      type: "string"
    },
    {
      key: "accessToken",
      value: "",
      type: "string"
    },
    {
      key: "templateId",
      value: "6a9874e598be009a93af641b",
      type: "string"
    },
    {
      key: "invoiceId",
      value: "6a987c4f47e38986ab434343",
      type: "string"
    }
  ],
  item: [
    {
      name: "1. Health & System",
      item: [
        {
          name: "Health Check Probe",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/health",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["health"]
            }
          }
        },
        {
          name: "Readiness DB Probe",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/ready",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["ready"]
            }
          }
        }
      ]
    },
    {
      name: "2. Authentication",
      item: [
        {
          name: "Register User",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "const timestamp = Date.now();",
                  "pm.collectionVariables.set('tempEmail', 'user_' + timestamp + '@example.com');"
                ],
                type: "text/javascript"
              }
            },
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.success && res.data && res.data.accessToken) {",
                  "    pm.collectionVariables.set('accessToken', res.data.accessToken);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Alex Mercer",
                email: "{{tempEmail}}",
                password: "SecurePass123!"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/auth/register",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "register"]
            }
          }
        },
        {
          name: "Login User",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.success && res.data && res.data.accessToken) {",
                  "    pm.collectionVariables.set('accessToken', res.data.accessToken);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "samridh@inkviz.app",
                password: "Password123!"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/auth/login",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "login"]
            }
          }
        },
        {
          name: "Refresh Access Token",
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/auth/refresh",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "refresh"]
            }
          }
        },
        {
          name: "Forgot Password",
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "samridh@inkviz.app"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/auth/forgot-password",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "forgot-password"]
            }
          }
        },
        {
          name: "Reset Password",
          request: {
            auth: { type: "noauth" },
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                token: "PUT_RESET_TOKEN_HERE",
                password: "NewPassword123!"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/auth/reset-password",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "reset-password"]
            }
          }
        },
        {
          name: "Logout User",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.collectionVariables.set('accessToken', '');"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/auth/logout",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "auth", "logout"]
            }
          }
        }
      ]
    },
    {
      name: "3. Users & Profile",
      item: [
        {
          name: "Get User Profile",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/users/me",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "users", "me"]
            }
          }
        },
        {
          name: "Update User Profile",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Samridh Chaudhary",
                defaultCurrency: "USD",
                invoicePrefix: "INV-"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/users/me",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "users", "me"]
            }
          }
        },
        {
          name: "Export User Data (GDPR)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/users/me/export",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "users", "me", "export"]
            }
          }
        },
        {
          name: "Delete Account",
          request: {
            method: "DELETE",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                confirmText: "delete my account"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/users/me",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "users", "me"]
            }
          }
        }
      ]
    },
    {
      name: "4. Templates",
      item: [
        {
          name: "List Invoice Templates",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.success && res.data && res.data.templates && res.data.templates.length > 0) {",
                  "    pm.collectionVariables.set('templateId', res.data.templates[0]._id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/templates",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "templates"]
            }
          }
        }
      ]
    },
    {
      name: "5. Invoices",
      item: [
        {
          name: "List Invoices (Active)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices?page=1&limit=10",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices"],
              query: [
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        },
        {
          name: "Create Invoice (Draft)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.success && res.data && res.data.invoice) {",
                  "    pm.collectionVariables.set('invoiceId', res.data.invoice._id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                templateId: "{{templateId}}",
                clientName: "Acme Innovations",
                clientEmail: "billing@acme.com",
                clientAddress: "123 Tech Blvd, Suite 400, San Francisco, CA",
                items: [
                  {
                    description: "Fullstack AI Application Engineering",
                    quantity: 20,
                    price: 125
                  },
                  {
                    description: "Cloud Infrastructure Deployment",
                    quantity: 1,
                    price: 500
                  }
                ],
                taxRate: 10,
                discountRate: 5,
                currency: "USD",
                issueDate: "2026-09-01T00:00:00.000Z",
                dueDate: "2026-09-15T00:00:00.000Z",
                notes: "Payment due within 14 days"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/invoices",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices"]
            }
          }
        },
        {
          name: "Get Invoice by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}"]
            }
          }
        },
        {
          name: "Update Invoice (Change Line Items & Recalculate)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "sent",
                items: [
                  {
                    description: "Fullstack AI Application Engineering",
                    quantity: 25,
                    price: 125
                  },
                  {
                    description: "Cloud Infrastructure Deployment",
                    quantity: 1,
                    price: 500
                  }
                ],
                notes: "Updated terms: Net 30"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}"]
            }
          }
        },
        {
          name: "Mark Invoice as Paid",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "paid"
              }, null, 2),
              options: {
                raw: { language: "json" }
              }
            },
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}"]
            }
          }
        },
        {
          name: "Soft Delete Invoice (Move to Trash)",
          request: {
            method: "DELETE",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}"]
            }
          }
        },
        {
          name: "List Trashed Invoices",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices/trash",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "trash"]
            }
          }
        },
        {
          name: "Restore Invoice from Trash",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}/restore",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}", "restore"]
            }
          }
        }
      ]
    },
    {
      name: "6. PDF Generation",
      item: [
        {
          name: "Download Invoice PDF",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5001/api/v1/invoices/{{invoiceId}}/download",
              protocol: "http",
              host: ["localhost:5001"],
              path: ["api", "v1", "invoices", "{{invoiceId}}", "download"]
            }
          }
        }
      ]
    }
  ]
};

const outputPath = path.join(__dirname, '..', 'Inkviz_Postman_Collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Successfully generated official Inkviz_Postman_Collection.json (Postman Collection v2.1.0 schema compliant)');
