# Backend Repository

A simple Express.js backend with Firebase integration.

## Project Structure

```
backend-repo/
├── config/             # Configuration files
│   └── firebaseConfig.ts
├── controller/         # API controllers
│   └── api.ts
├── core/               # Core application files
│   └── app.ts
├── entities/           # Data models and interfaces
│   └── user.ts
├── middleware/         # Express middleware
│   └── authMiddleware.ts
├── repository/         # Data access layer
│   └── userCollection.ts
├── routes/             # API routes
│   └── userRoutes.ts
├── scripts/            # Utility scripts
│   └── verify-firebase.ts
├── serviceAccountKey.example.json  # Example Firebase credentials format
├── FIREBASE-CREDENTIALS.md  # Detailed Firebase credential setup instructions
└── package.json        # Project dependencies
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template
4. Set up Firebase credentials:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Generate a service account key and save it in the project
   - Update the `.env` file with your Firebase configuration
   - **For detailed instructions on setting up Firebase credentials, see [FIREBASE-CREDENTIALS.md](./FIREBASE-CREDENTIALS.md)**
5. Verify your Firebase setup:
   ```
   npm run verify-firebase
   ```
   This script will check if your Firebase connection is working correctly and provide helpful troubleshooting information if there are issues.

### Detailed Firebase Setup Instructions

#### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" or "Create a project"
3. Enter a project name (e.g., "ebuddy-backend")
4. Choose whether to enable Google Analytics (optional)
5. Accept the terms and click "Create project"
6. Wait for the project to be created, then click "Continue"

#### 2. Set Up Firestore Database
1. In the Firebase Console, select your project
2. In the left navigation menu, click on "Firestore Database"
3. Click "Create database"
4. Choose "Start in production mode" or "Start in test mode" (for development, test mode is easier as it allows all reads/writes)
5. Select a database location closest to your users
6. Click "Enable"
7. After Firestore is enabled, go to the "Rules" tab
8. For development purposes, you can use the following rules (but secure them for production):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
9. Click "Publish"

#### 3. Create a USERS Collection
1. In the Firestore Database, click "Start collection"
2. Enter "USERS" as the Collection ID
3. Click "Next"
4. Add a test document with the following fields:
   - Document ID: "test-user-1"
   - Fields:
     - name (string): "Test User"
     - email (string): "test@example.com"
     - createdAt (timestamp): [current date/time]
     - updatedAt (timestamp): [current date/time]
5. Click "Save"

#### 4. Generate Service Account Credentials
1. In the Firebase Console, click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Go to the "Service accounts" tab
3. Click "Generate new private key" button at the bottom
4. Confirm by clicking "Generate key"
5. A JSON file will be downloaded - this is your service account key
6. Move this file to your project directory (e.g., `backend-repo/serviceAccountKey.json`)
7. **IMPORTANT**: Never commit this file to version control! Ensure it's included in `.gitignore`

#### 5. Configure Environment Variables
1. Create a `.env` file in the root of your project based on the `.env.example` template
2. Set the following variables:
   ```
   FIREBASE_DATABASE_URL=https://<YOUR-PROJECT-ID>.firebaseio.com
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   PORT=3000
   NODE_ENV=development
   ```
3. Replace `<YOUR-PROJECT-ID>` with your Firebase project ID (found in Project settings)
4. Update `GOOGLE_APPLICATION_CREDENTIALS` to point to the location where you saved your service account key file (e.g., `./serviceAccountKey.json`). Make sure the path is relative to the root of your project.

#### 6. Update Firebase Configuration (Alternative Method)
If you prefer not to use environment variables for credentials, you can also directly initialize Firebase in `config/firebaseConfig.ts`:

```typescript
import * as admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';  // You'll need to update tsconfig.json to allow JSON imports

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://<YOUR-PROJECT-ID>.firebaseio.com'
  });
}

export const db = admin.firestore();
// ... rest of the code
```

## Development

Start the development server:
```
npm run dev
```

## API Endpoints

### Fetch User Data
- **URL**: `/api/user/:userId`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**: User object

### Update User Data
- **URL**: `/api/user/:userId`
- **Method**: `PUT`
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Response**: Updated user object

## Authentication Explanation

**Note about `test-token`**: For simplicity in this assignment, the authentication middleware is implemented with a minimal validation approach:

- The middleware checks for a token in the `Authorization: Bearer <token>` header format
- Any token value works **except** for `invalid-token` (which is specifically rejected)
- When testing the API, you can use any string (like `test-token`) in the examples

In a real production application:
1. You would implement proper Firebase Authentication
2. Users would sign in through Firebase Auth to get real JWT tokens
3. The middleware would verify these tokens using `admin.auth().verifyIdToken(token)`

The current implementation is for demonstration purposes only and simulates a user with:
```json
{
  "uid": "simulated-user-id",
  "email": "test@example.com"
}
```

To test authentication failure, use:
```bash
curl -X GET http://localhost:3000/api/user/test-user-1 \
  -H "Authorization: Bearer invalid-token"
```

## Testing the API
After setting up Firebase, test your API with curl or Postman:

### Using curl
1. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```
   
2. Fetch user data:
   ```bash
   curl -X GET http://localhost:3000/api/user/test-user-1 \
     -H "Authorization: Bearer test-token"
   ```
   
3. Update user data:
   ```bash
   curl -X PUT http://localhost:3000/api/user/test-user-1 \
     -H "Authorization: Bearer test-token" \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated User", "email": "updated@example.com"}'
   ```

## Build for Production

```
npm run build
npm start
``` 