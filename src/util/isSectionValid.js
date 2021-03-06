import {every} from 'lodash';

import validateQuestion from './validateQuestion';
import isQuestionAnswered from './isQuestionAnswered';

const isSectionValid = (section, rows) => every(
    rows,
    row => every(
        row.questions,
        question => isQuestionAnswered(question, section) && validateQuestion(question, section[question.name])
    )
);

export default isSectionValid;
