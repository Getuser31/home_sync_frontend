const React = require('react');

class MockedProvider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {children} = this.props;
        if (children) {
            return React.createElement(React.Fragment, null, children);
        }
        return null;
    }

    componentWillUnmount() {
    }
}

module.exports = {
    MockedProvider,
    MockLink: class {
    },
    MockSubscriptionLink: class {
    },
};
