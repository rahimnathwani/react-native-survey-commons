import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View} from 'react-native';
import {Row} from '@indec/react-native-commons';
import {ComponentsRegistry} from '@indec/react-native-form-builder';
import {stylePropType} from '@indec/react-native-commons/util';

import canAnswerQuestion from '../../util/canAnswerQuestion';
import QuestionMessages from '../QuestionMessages';

const Form = ({
    chapter, onChange, rows, style, questionStyles, registry
}) => (
    <ScrollView style={style.container}>
        {rows.map(row => (
            <Row key={row.id} style={style.row}>
                {filter(
                    row.questions,
                    question => (question.renderValidator?question.renderValidator(question, chapter):canAnswerQuestion(question, chapter))
                ).map(question => {
                    const QuestionComponent = registry.get(question.type);
                    const questionStyle = questionStyles[question.type] || {};
                    return (
                        <View style={{flex: 1}}>
                            <QuestionComponent
                                key={question.number}
                                question={question}
                                section={chapter}
                                answer={chapter[question.name]}
                                onChange={answer => onChange(answer)}
                                style={questionStyle.style}
                                textWithBadgeStyle={questionStyle.textWithBadgeStyle}
                            />
                            {
                                chapter[question.name] !== null &&
                                chapter[question.name] !== undefined &&
                                <QuestionMessages
                                    chapter={chapter}
                                    answer={chapter[question.name]}
                                    errorValidators={question.errorValidators}
                                    warningValidators={question.warningValidators}
                                />
                            }
                        </View>
                    );
                })}
            </Row>
        ))}
    </ScrollView>
);

Form.propTypes = {
    rows: PropTypes.shape({}).isRequired,
    chapter: PropTypes.shape({}),
    onChange: PropTypes.func.isRequired,
    questionStyles: PropTypes.shape({}),
    style: stylePropType,
    registry: PropTypes.shape({})
};

Form.defaultProps = {
    chapter: {},
    style: {},
    questionStyles: {},
    registry: new ComponentsRegistry()
};

export default Form;
