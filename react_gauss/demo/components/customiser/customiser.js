import React from 'react';
import PropTypes from 'prop-types';
import BorderPicker from 'components';
import Styles from './customiser.scss';

function applyStyles(elements, { property, value }) {
  elements.forEach(element => {
    element.style.setProperty(property, value);
  });
}

export var slider = {};

class Customiser extends React.Component {
  static propTypes = {
    repository: PropTypes.string.isRequired,
    module: PropTypes.object.isRequired,
    handlePopover: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    componentClass: PropTypes.string,
    properties: PropTypes.array.isRequired,
    globalProps: PropTypes.array.isRequired,
  };

  static defaultProps = {
    componentClass: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      customized: false,
      popoverOpened: false,
    };
    if (typeof window !== 'undefined') {
      window.setElement = this.setElement;
    }
  }

  state = {
    element: null,
  };


  UNSAFE_componentWillMount() {
    this.updateProperties(this.props);
  }

  componentDidMount() {
    this.updateAllValues(this.props);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.theme !== newProps.theme) {
      this.updateValues = true;
    }
  }

  componentDidUpdate() {
    if (this.updateValues === true) {
      this.updateValues = false;
      // this.updateElement(this.props.componentClass);
      this.updateAllValues(this.props);
    }
  }

  setElement = element => {
    this.element = element;
    this.updateAllValues(this.props);
  };

  getStylesText() {
    const text = ['<p><b>.aws-btn</b> {</p><ul>'];
    this.props.properties.forEach(section => {
      section.props.forEach(prop => {
        const name = `--${prop.name}`;
        text.push(
          `<li><b>${name}</b>: <em>${this.state[name]}${prop.suffix ||
            ''}</em>;</li>`
        );
      });
    });
    text.push('</ul><p>}</p>');
    return text.join('');
  }

  updateAllValues(newProps) {
    const state = {
      customized: false,
    };
    if (!this.element) {
      return false;
    }
    newProps.properties.forEach(section => {
      section.props.forEach(prop => {
        const name = `--${prop.name}`;
        let style = getComputedStyle(this.element)
          .getPropertyValue(name)
          .trim();
        if (style.match(/(#)([a-z0-9]{3})($)/)) {
          style = style.replace(/(#)([a-z0-9]{3})/, '$1$2$2');
        }
        if (style.match(/(px|em|ms|s|%)$/)) {
          style = style.replace(/px|em|ms|s|%/gi, '');
        }
        state[name] = style;
        if (typeof window !== 'undefined') {
          applyStyles(
            document.querySelectorAll(
              `[data-role="customizable"] .${this.props.componentClass}`
            ),
            {
              property: name,
              value: style + (prop.suffix || ''),
            }
          );
        }
      });
    });
    this.setState(state);
    return true;
  }

  updateProperties(newProps) {
    if (newProps.properties) {
      const state = {};
      newProps.properties.forEach(section => {
        section.props.forEach(prop => {
          state[`--${prop.name}`] = null;
        });
      });
      this.setState(state);
    }
  }

  updateElement(className) {
    if (this.control) {
      this.element = this.control.querySelector(`.${className}`);
    }
  }

  resetStyles = () => {
    this.setState({
      customized: false,
    });
    this.updateElement(this.props.componentClass);
    this.updateAllValues(this.props);
    this.resetContext();
  };

  resetContext() {
    this.context.resetGeneral();
  }

  exportStyles = () => {
    this.setState(
      {
        popoverOpened: true,
      },
      () => {
        this.props.handlePopover({
          popoverOpened: true,
          popoverText: this.getStylesText(),
        });

      }
    );
  };

  getSliderValue(){
    slider = {
      quality: 0,
      radius: 0
    };
    this.props.properties.forEach(section => {
      section.props.forEach(prop => {
        const name = `--${prop.name}`;
        slider[`${prop.name}`] = this.state[name];

      });
    });
  }

  updatePopoverText() {
    this.getSliderValue();
    this.props.handlePopover({
      popoverText: this.getStylesText(),
    });

  }

  renderInputs(props) {
    return props.map(cssProperty => {
      const { name, type, global, defaultValue } = cssProperty;
      const buttonName = `--${name}`;
      const extraProps = {};
      extraProps.type = type;

      let inputValue = this.state[buttonName] || '';

      let displayValue = this.state[buttonName]
        ? `${this.state[buttonName]}${cssProperty.suffix || ''}` || ''
        : '';

      if (global) {
        inputValue = this.context.general.hasOwnProperty(buttonName)
          ? this.context.general[buttonName]
          : defaultValue;
      }

      if (type === 'range') {
        extraProps.type = type;
        extraProps.min = cssProperty.min || 0;
        extraProps.max = cssProperty.max || 10;
        extraProps.step = cssProperty.step || 1;
      }

      const onChange = event => {
        if (this.state.customized === false) {
          this.setState({ customized: true });
        }
        const { target } = event;
        const state = {};
        let value = type === 'checkbox' ? target.checked : target.value;

        state[buttonName] = value;

        this.setState(state, () => {
          this.updatePopoverText();
        });

        if (global) {
          this.context.setGeneral({
            ...this.context.general,
            [`${buttonName}`]: value,
          });
        }

        if (typeof window !== 'undefined') {
          if (cssProperty.suffix) {
            value = `${value}${cssProperty.suffix}`;
          }

          applyStyles(
            document.querySelectorAll(
              `[data-role="customizable"] .${this.props.componentClass}`
            ),
            {
              property: buttonName,
              value,
            }
          );
        }
      };

      let input = null;
      switch (type) {
        case 'border':
          input = (
            <BorderPicker
              value={inputValue}
              onChange={onChange}
              {...extraProps}
            />
          );
          break;
        default:
          input = (
            <input value={inputValue} onChange={onChange} {...extraProps} />
          );
      }

      return (
        <li key={buttonName}>
          <label>
            <code>{name}</code>
          </label>
          <div>{input}</div>
          <div>
            <span>{displayValue}</span>
          </div>
        </li>
      );
    });
  }

  renderSection(section) {
    const listClass = section.name ? null : Styles.untitledSection;
    return (
      <section key={section.name}>
        <h4>{section.name}</h4>
        <ul className={listClass}>{this.renderInputs(section.props)}</ul>
      </section>
    );
  }

  renderSections(sections) {
    return sections.map(section => this.renderSection(section));
  }

  render() {
    return (
      <section className={Styles.container}>
        <header>
          <h3>Shader Settings</h3>
        </header>
        <ul>{this.renderSections(this.props.properties)}</ul>
      </section>
    );
  }
}

export default  Customiser;
