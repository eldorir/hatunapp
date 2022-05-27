syncContacts() {
    if (Platform.OS === "android") {
        console.log("ask permission dialog")
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: "Contacts",
            message: "This app would like to view your contacts."
        }).then(() => {
            this.loadContacts();
        });
    } else {
        this.loadContacts();
    }
}