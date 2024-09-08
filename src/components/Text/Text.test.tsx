import { render } from '@/utils/test';

import Text from './Text';

describe('Text', () => {
  it('On press should be pressed', () => {
    const content = 'Text component test';
    const { getByTestId } = render(
      <Text testID="text-component">{content}</Text>,
    );
    const title = getByTestId('text-component');
    expect(title.children?.[0]).toBe(content);
  });
});
