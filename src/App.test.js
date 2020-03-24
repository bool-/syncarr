import React from 'react';
import { render } from '@testing-library/react';
import Syncarr from './Syncarr';

test('renders learn react link', () => {
  const { getByText } = render(<Syncarr />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
