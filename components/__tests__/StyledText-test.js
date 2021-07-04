import * as React from "react";
import renderer from "react-test-renderer";
import { Text } from "react-native";

it("renders correctly", () => {
  // eslint-disable-next-line react-native/no-raw-text
  const tree = renderer.create(<Text>Snapshot test!</Text>).toJSON();

  expect(tree).toMatchSnapshot();
});
