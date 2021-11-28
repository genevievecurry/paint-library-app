import { render } from '@testing-library/svelte';
import Description from './_Description.svelte';

const validProps = {
  communityDescription: 'communityDescription',
  manufacturerDescription: 'manufacturerDescription',
  manufacturerPigmentDescription: 'manufacturerPigmentDescription',
  manufacturerName: 'Paint Maker',
};

test('shows manufacturerDescription section when rendered', () => {
  const { getByText } = render(Description, { props: validProps });
  expect(getByText(validProps.manufacturerName, { exact: false })).toBeInTheDocument();
  expect(getByText(validProps.manufacturerDescription)).toBeInTheDocument();
});

test('shows communityDescription section when rendered', () => {
  const { getByText } = render(Description, { props: validProps });
  expect(getByText(validProps.communityDescription)).toBeInTheDocument();
});
