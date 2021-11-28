/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/svelte';
import Header from '../_Header.svelte';

const validProps = {
  title: 'Some Cool Paint',
  manufacturerName: 'Paint Maker',
};

test('shows paint title when rendered', () => {
  const { getByText } = render(Header, { props: validProps });
  expect(getByText(validProps.title)).toBeInTheDocument();
});

test('shows paint manufacturer when rendered', () => {
  const { getByText } = render(Header, { props: validProps });
  expect(getByText(validProps.manufacturerName)).toBeInTheDocument();
});
