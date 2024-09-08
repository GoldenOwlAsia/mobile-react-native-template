import { fireEvent, render } from '@/utils/test';

import Button from './Button';

describe('Button', () => {
  it('On press should be pressed', () => {
    const mockedOnPress = jest.fn();
    const component = render(<Button text="Button" onPress={mockedOnPress} />);
    const buttonView = component.getByTestId('button-view');
    fireEvent.press(buttonView);
    expect(mockedOnPress).toHaveBeenCalledTimes(1);
  });
});
