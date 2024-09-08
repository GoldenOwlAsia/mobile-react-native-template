import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/stores';

export default (): AppDispatch => {
  const dispatch = useDispatch<AppDispatch>();
  return dispatch;
};
