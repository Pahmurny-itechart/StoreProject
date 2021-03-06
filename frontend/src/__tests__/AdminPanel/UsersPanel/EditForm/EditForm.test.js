import React from 'react';
import EditFormConnected, { EditForm } from '../../../../AdminPanel/UsersPanel/EditForm';
import { shallow, configure, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });

function setupComponent(props = {
    userToEdit: {
        show: false,
        id: null,
        username: '',
        email: '',
        password: '',
        role: ''
    },
    onHide: ()=>{},
    addErrorToState: ()=>{}
}) {
    let component = shallow(<EditForm {...props} />);
    return { component, props };
}

describe('EditForm --- Snapshot', () => {
    it('Component must be rendered', () => {
        let { component } = setupComponent();
        expect(EditForm.propTypes.userToEdit).toBe(PropTypes.object);
        expect(EditForm.propTypes.onHide).toBe(PropTypes.func);
        expect(shallowToJson(component)).toMatchSnapshot();
    });
});


describe('EditForm ', () => {
    let initialState = {
        adminPanel_usersPanel: {
            userToEdit: {
                show: false,
                id: null,
                username: '',
                email: '',
                password: '',
                role: ''
            }
        }
    };

    const mockStore = configureStore();
    let store, wrapper;
    
    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}><EditFormConnected /></Provider>);
    });
    it('+++ render the connected(SMART) component',() => {
        expect(wrapper.find(EditFormConnected).length).toEqual(1);
    });
});

