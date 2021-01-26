import { Button } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import React from "react";

interface RightArrowButtonProps { 
  click: (XrayModel: string | void, CTModel: string | void) => (() => void)
  className?: string
  XrayModel?: string
  CTModel?: string
}

const RightArrowButton: React.FC<RightArrowButtonProps> = ({click, XrayModel, CTModel, className, children, }) => {

  if (XrayModel || CTModel) {
    return (
      <Button className={className} variant="primary" onClick={click(XrayModel, CTModel)}>
        {children} <ArrowRightIcon></ArrowRightIcon>
      </Button>
    )
  } else {
    return (
      <Button className={className} variant="primary" onClick={click()}>
        {children} <ArrowRightIcon></ArrowRightIcon>
      </Button>
    )
  }
  
}

export default RightArrowButton;