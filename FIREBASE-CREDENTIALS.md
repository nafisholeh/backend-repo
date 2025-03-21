# Firebase Service Account Setup

## About the Service Account Key

The `serviceAccountKey.example.json` file in this repository is just a template showing the structure of a Firebase service account key. 

**IMPORTANT: DO NOT use this example file in your application!**

## How to Set Up Your Service Account Key

1. Download your actual service account key from Firebase Console:
   - Go to your Firebase project
   - Click the gear icon (⚙️) and select "Project settings"
   - Go to the "Service accounts" tab
   - Click "Generate new private key"
   - Save the downloaded file

2. Rename the downloaded file to `serviceAccountKey.json`

3. Move the file to the root of your project (same directory as this README)

4. Make sure `serviceAccountKey.json` is listed in your `.gitignore` file to prevent accidentally committing it

5. Update your `.env` file to point to this file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```

## Security Warning

The service account key grants admin access to your Firebase project. **NEVER share it or commit it to version control!**

If you accidentally expose your key:
1. Delete the compromised key in Firebase Console
2. Generate a new key
3. Update your local files

## Structure of a Service Account Key

The service account key is a JSON file with this structure:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

The real file will contain your project's actual credentials and should be kept secret! 