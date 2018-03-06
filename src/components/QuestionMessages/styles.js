import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    messagesContainer: {
        marginTop: 7
    },
    messageContainer: {
        marginTop: 5,
        padding: 7,
        borderRadius: 5
    },
    errorMessageContainer: {
        backgroundColor: 'red'
    },
    warningMessageContainer: {
        backgroundColor: 'orange'
    },
    message: {
        fontWeight: 'bold',
        color: 'white'
    }
});
