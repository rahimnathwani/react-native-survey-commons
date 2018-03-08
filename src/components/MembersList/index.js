import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Text, View} from 'react-native';
import Table, {TableIcon} from '@indec/react-native-table';
import {Button, LoadingIndicator, Title} from '@indec/react-native-commons';
import {Alert} from '@indec/react-native-commons/util';
import {isEmpty, map} from 'lodash';

import NavigationButtons from '../NavigationButtons';
import {requestMembers, requestCloseHouseholdVisit, requestRemoveMember} from '../../actions/survey';
import matchParamsIdPropTypes from '../../util/matchParamsIdPropTypes';
import {Member} from '../../model';
import styles from './styles';

const getMembersCharacteristics = members => map(members, member => ({
    ...member,
    name: member.characteristics.name,
    relationship: member.characteristics.relationship,
    isHomeBoss: member.isHomeBoss()
}));

class MembersList extends Component {
    static propTypes = {
        requestCloseHouseholdVisit: PropTypes.func.isRequired,
        requestMembers: PropTypes.func.isRequired,
        requestRemoveMember: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onViewDetection: PropTypes.func.isRequired,
        onViewDetails: PropTypes.func.isRequired,
        onAddMember: PropTypes.func.isRequired,
        showCharacteristicsButton: PropTypes.func,
        match: matchParamsIdPropTypes.isRequired,
        members: PropTypes.arrayOf(PropTypes.instanceOf(Member)),
        saving: PropTypes.bool
    };

    static defaultProps = {
        members: null,
        saving: false,
        showCharacteristicsButton: true
    };

    constructor(props) {
        super(props);
        this.columns = [{
            id: 1,
            label: 'Número',
            field: 'order'
        }, {
            id: 2,
            label: 'Nombre',
            field: 'name'
        }, {
            id: 3,
            label: 'Relación',
            field: 'relationship'
        }, {
            id: 4,
            componentClass: TableIcon,
            icon: 'arrow-right',
            color: '#0295cf',
            onPress: member => this.props.onSelect(member)
        }, {
            id: 5,
            componentClass: TableIcon,
            icon: 'trash',
            color: 'red',
            hideValue: member => member.isHomeBoss,
            onPress: member => Alert.alert(
                'Atención',
                `¿Desea eliminar la persona N° ${member.order}, recuerde que esto es permanente?`,
                [{
                    text: 'Cancelar'
                }, {
                    text: 'Confirmar',
                    onPress: () => this.props.requestRemoveMember(
                        this.props.match.params.id,
                        this.props.match.params.dwellingOrder,
                        this.props.match.params.householdOrder,
                        member.order
                    )
                }]
            )
        }];
    }

    componentWillMount() {
        const {id, dwellingOrder, householdOrder} = this.props.match.params;
        this.props.requestMembers(id, dwellingOrder, householdOrder);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.saving && !nextProps.saving) {
            this.props.onSubmit();
        }
    }

    handleCloseHouseholdVisit() {
        const {id, dwellingOrder, householdOrder} = this.props.match.params;
        Alert.alert(
            'Atención',
            'Usted está por cerrar la visita, ¿Desea continuar?. Recuerde que esta operación es irreversible.',
            [{
                text: 'Cancelar'
            }, {
                text: 'Confirmar',
                onPress: () => this.props.requestCloseHouseholdVisit(id, dwellingOrder, householdOrder)
            }]
        );
    }

    renderButtons() {
        const {dwellingOrder, householdOrder} = this.props.match.params;
        const {showCharacteristicsButton, members} = this.props;
        return (
            <View style={styles.actionButtons}>
                {showCharacteristicsButton(members) && <Button
                    onPress={
                        () => this.props.onViewDetails(dwellingOrder, householdOrder)
                    }
                    primary
                    title="Características habitacionales del hogar"
                />}
                <Button
                    onPress={() => this.props.onAddMember()}
                    primary
                    title="Gestión de personas"
                />
                <Button
                    buttonStyle={styles.marginTopButton}
                    onPress={
                        () => this.props.onViewDetection(dwellingOrder, householdOrder)
                    }
                    primary
                    title="Situación de la vivienda"
                />
            </View>
        );
    }

    renderContent() {
        const {members} = this.props;
        return (
            <Fragment>
                {this.renderButtons()}
                <View style={styles.tableContainer}>
                    <Title>Listado de Personas del Hogar</Title>
                    {isEmpty(members) && <Text style={styles.informationText}>&nbsp; El hogar no posee personas</Text>}
                    {!isEmpty(members) &&
                    <View style={styles.tableContainer}>
                        <Table columns={this.columns} data={getMembersCharacteristics(members)}/>
                    </View>}
                </View>
                <NavigationButtons
                    onSubmit={() => this.handleCloseHouseholdVisit()}
                    iconRight={{name: 'lock', color: '#333'}}
                    submitButtonText="Cerrar visita"
                />
            </Fragment>
        );
    }

    render() {
        return this.props.members ? this.renderContent() : <LoadingIndicator/>;
    }
}

export default connect(
    state => ({
        members: state.survey.members,
        saving: state.survey.saving
    }),
    dispatch => ({
        requestMembers: (id, dwellingOrder, householdOrder) => (
            dispatch(requestMembers(id, dwellingOrder, householdOrder))
        ),
        requestCloseHouseholdVisit: (id, dwellingOrder, householdOrder) => dispatch(
            requestCloseHouseholdVisit(id, dwellingOrder, householdOrder)
        ),
        requestRemoveMember: (id, dwellingOrder, householdOrder, memberOrder) => dispatch(
            requestRemoveMember(id, dwellingOrder, householdOrder, memberOrder)
        )
    })
)(MembersList);
