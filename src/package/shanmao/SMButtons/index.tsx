import React, { useState } from 'react';
import { Space, Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/es/button';

interface SMButtonsInterface {
  (): JSX.Element;
}

export type SMButtonsProps = {
    buttons: Array<ButtonConfig>;
}

type ButtonConfig = ButtonProps & {
    label: string;
    tips?: string;
}

const propsKey = Symbol('propsKey');

function useSMButtons (props: SMButtonsProps) {
  const SMButtonsFactory: SMButtonsInterface = () => {
    const {
      buttons,
    } = SMButtons[propsKey];

    exportAPI();

    return (
      <Space size={9}>
        {buttons.map((button) => {
          const { label, tips, ...buttonProps } = button;
          const nextButtonProps = {
            ...buttonProps,
            style: {
              minWidth: 74,
              ...buttonProps.style,
            },
          };

          return (
            tips ? (
              <Tooltip title={tips}>
                <Button {...nextButtonProps} key={label}>{label}</Button>
              </Tooltip>
            ) : (
              <Button {...nextButtonProps} key={label}>{label}</Button>
            )
          );
        })}
      </Space>
    );

    function exportAPI () {
      Object.assign(SMButtons, {
        // ...
      });
    }
  };

  const [ SMButtons ] = useState(() => SMButtonsFactory);

  SMButtons[propsKey] = props;

  return SMButtons;
}

export default useSMButtons;
