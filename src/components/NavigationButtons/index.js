import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Button, Col, Row} from '@indec/react-native-commons';
import {getFontAwesome} from '@indec/react-native-commons/util';

import styles from './styles';

const NavigatorButtons = ({
    onBack, submitButtonText, onSubmit, disableSubmit
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
                    disabled={disableSubmit}
                    title={submitButtonText}
                    onPress={onSubmit}
                    rounded
                />
            </Col>
        </Row>
    </View>
);

NavigatorButtons.propTypes = {
    onBack: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string,
    disableSubmit: PropTypes.bool
};

NavigatorButtons.defaultProps = {
    submitButtonText: 'Siguiente',
    disableSubmit: false
};

export default NavigatorButtons;
