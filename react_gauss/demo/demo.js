import React from 'react';
import {
  Header,
  Customiser,
  Body,
  Composer,

} from 'components';
import styles from './demo.scss';
import Data from './data.json';
import data from './image';

const theme = 'images';

const HeaderComponent = () => {
  return (
    <Header
      title={Data.title}
      framework={Data.framework}
    />
  );
};


const ComposerComponent = ({ handlePopover }) => {
  return (
    <Customiser
      handlePopover={handlePopover}
      properties={data[theme].properties}
    />
  );
};


class Demo extends React.Component {
  handlePopover = popover => {
    this.setState(popover);
  };


  render() {
    return (
          <div>
            <Body>
              <HeaderComponent />
              <data.images.example.Component />
            </Body>
            <Composer>
              <ComposerComponent
                handlePopover={this.handlePopover}
              />
            </Composer>
          </div>
    );
  }
}

export default Demo;
