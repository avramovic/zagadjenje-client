import React from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";
import NavigationPrompt from "react-router-navigation-prompt";
import NavigationConfirmModal from "react/common/ui/NavigationConfirmModal";
import { Form, Text } from "react-form";

const propTypes = {
    saveNewPerson: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.object.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

class PersonCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: "",
                password: "",
                realname: "",
                role: { display_name: "Select a role", name: "" }
            },
            redirectToPeopleList: false,
            isFormDirty: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.renderRoles = this.renderRoles.bind(this);
        this.validateName = this.validateName.bind(this);
    }

    handleChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.id]: event.target.value
            }
        });
    }

    validateName(value) {
        // TODO: implement react-form validation
        const validationResults = {
            error: null,
            warning: null,
            success: null
        };
        if (this.state.isFormDirty) {
            if (value.length < 2) {
                validationResults.error =
                    "Error: Value should be more than two characters.";
            }
        }
        return validationResults;
    }

    handleOptionChange(event) {
        const index = event.nativeEvent.target.selectedIndex;
        const selectedText = event.nativeEvent.target[index].text;
        const selectedRole = event.nativeEvent.target[index].value;
        this.setState({
            form: {
                ...this.state.form,
                [event.target.id]: {
                    display_name: selectedText,
                    name: selectedRole
                }
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const person = Object.assign({}, this.state.form);
        person.role = this.state.form.role.name;
        this.props.saveNewPerson(person).then(response => {
            if (!response.ok) {
                // after failure, state remains
                // TBD after we figure out endpoints
                this.props.history.push("/404");
            } else {
                // after success, clear state
                this.setState(() => ({
                    redirectToPeopleList: true,
                    form: {}
                }));
            }
        });
    }

    renderRoles() {
        return (
            <label htmlFor="role">
                Role
                <select
                    value={this.state.form.role.name}
                    onChange={this.handleOptionChange}
                    id="role"
                >
                    <option value="" default disabled>
                        Select A Value...
                    </option>
                    {this.props.roles.map(role => (
                        <option key={role.id} value={role.name}>
                            {role.display_name}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    render() {
        if (this.state.redirectToPeopleList === true) {
            return <Redirect to="/settings/users" />;
        }
        return (
            <BrowserRouter>
                <main role="main">
                    <div>
                        <h3>Add people to Ushahidi</h3>
                        <p>
                            Add members of your team, stakeholders, and other
                            members of your community to Ushahidi.
                        </p>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="realname">
                            Name
                            <input
                                type="text"
                                placeholder="What is this person's full name"
                                id="realname"
                                value={this.state.form.realname}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="email">
                            Email
                            <input
                                type="text"
                                placeholder="email"
                                id="email"
                                value={this.state.form.email}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="password">
                            Password
                            <input
                                type="password"
                                placeholder="password"
                                id="password"
                                value={this.state.form.password}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        {this.props.isLoading.REQUEST_ROLES ? (
                            <InlineLoading />
                        ) : (
                            this.renderRoles()
                        )}
                        <Link to="/settings/users">
                            <button className="button-beta">Cancel</button>
                        </Link>
                        <button type="submit">Submit</button>
                    </form>
                </main>
            </BrowserRouter>
        );
    }
}
PersonCreateForm.propTypes = propTypes;
export default PersonCreateForm;