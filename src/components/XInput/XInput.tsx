import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks';

const XTextInput = ({ ...props }: TextInputProps) => {
  const { Common } = useTheme();
  return <TextInput style={[Common.input.outline]} {...props} />;
};
export default XTextInput;
