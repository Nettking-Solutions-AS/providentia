import * as React from "react";

import { Text, TextProps } from "./Themed";

// eslint-disable-next-line import/prefer-default-export
export function MonoText(props: TextProps) {
  return (
    // eslint-disable-next-line react/destructuring-assignment,react-native/no-inline-styles,react/jsx-props-no-spreading
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}
