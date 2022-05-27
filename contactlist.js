class ContactList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        Contacts.iosEnableNotesUsage(false);
    }

    async componentDidMount() {
        this.syncContacts()
    }

    syncContacts() {
        
    }

    render() {
        //UI elements
    }
}

const mapStateToProps = (state) => {
    const { contacts } = state
    return { contacts }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        syncContacts,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);