import React from 'react';
import PropTypes from 'prop-types';
import {Alert, View} from 'react-native';
import {Button, Col, Row} from '@indec/react-native-commons';
import {getFontAwesome} from '@indec/react-native-commons/util';

import styles from './styles';

const alert = (props, onSubmit) => Alert.alert(
    props.name,
    props.description,
    [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => onSubmit()}
    ],
    {cancelable: false}
);

const NavigatorButtons = ({
    onBack,
    submitButtonText,
    props,
    onSubmit
}) => (
    <View style={styles.container}>
        <Row>
            <Col>
                <Button
                    icon={getFontAwesome('chevron-left', '#333')}
                    title="Anterior"
                    onPress={onBack}
                    rounded
                />
            </Col>
            <Col>
                <Button
                    icon={getFontAwesome('chevron-right', '#333')}
                    title={submitButtonText}
                    onPress={() => alert(props, onSubmit)}
                    rounded
                />
            </Col>
        </Row>
    </View>
);

NavigatorButtons.propTypes = {
    onBack: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    props: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    submitButtonText: PropTypes.string
};

NavigatorButtons.defaultProps = {
    submitButtonText: 'Siguiente'
};

export default NavigatorButtons;
