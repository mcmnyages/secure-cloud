export const notificationMock = {
    "messages": [
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Upload complete",
                "body": "Your file 'project_report.pdf' has been successfully uploaded."
            },
            "data": {
                "click_action": "OPEN_FILE",
                "fileId": "file-001"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Storage almost full",
                "body": "You're running out of space. Only 10% storage remaining."
            },
            "data": {
                "click_action": "OPEN_STORAGE_SETTINGS",
                "storageLevel": "10%"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "File shared with you",
                "body": "John shared 'team_notes.docx' with you."
            },
            "data": {
                "click_action": "OPEN_SHARED_FILE",
                "fileId": "file-002"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Sync completed",
                "body": "All your files are now up to date across devices."
            },
            "data": {
                "click_action": "OPEN_SYNC_STATUS",
                "status": "completed"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "New folder created",
                "body": "Your folder 'Invoices 2026' is ready."
            },
            "data": {
                "click_action": "OPEN_FOLDER",
                "folderId": "folder-101"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "File deleted",
                "body": "'old_backup.zip' has been moved to trash."
            },
            "data": {
                "click_action": "OPEN_TRASH",
                "fileId": "file-003"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Backup successful",
                "body": "Your photos have been backed up securely."
            },
            "data": {
                "click_action": "OPEN_BACKUPS",
                "backupId": "backup-77"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "File updated",
                "body": "'budget.xlsx' was modified recently."
            },
            "data": {
                "click_action": "OPEN_FILE",
                "fileId": "file-004"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Offline access ready",
                "body": "Selected files are now available offline."
            },
            "data": {
                "click_action": "OPEN_OFFLINE_FILES",
                "status": "ready"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Upload failed",
                "body": "We couldn't upload 'video.mp4'. Tap to retry."
            },
            "data": {
                "click_action": "RETRY_UPLOAD",
                "fileId": "file-005"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "New comment added",
                "body": "A comment was added to 'design_mockup.png'."
            },
            "data": {
                "click_action": "OPEN_COMMENTS",
                "fileId": "file-006"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Version history available",
                "body": "Older versions of 'report.docx' can now be restored."
            },
            "data": {
                "click_action": "OPEN_VERSION_HISTORY",
                "fileId": "file-007"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "New device signed in",
                "body": "Your account was accessed from a new device."
            },
            "data": {
                "click_action": "OPEN_SECURITY_SETTINGS",
                "alertType": "new_device"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Folder shared",
                "body": "You shared 'Marketing Assets' with your team."
            },
            "data": {
                "click_action": "OPEN_FOLDER",
                "folderId": "folder-202"
            }
        },
        {
            "token": "device_registration_token_here",
            "notification": {
                "title": "Storage upgraded",
                "body": "Your storage plan has been successfully upgraded."
            },
            "data": {
                "click_action": "OPEN_PLAN_DETAILS",
                "plan": "premium"
            }
        }
    ]
}