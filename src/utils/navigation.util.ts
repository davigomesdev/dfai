import { NavigateFunction } from 'react-router-dom';

export let navigateTo: NavigateFunction | null = null;

export const setupNavigate = (navigate: NavigateFunction): void => {
  navigateTo = navigate;
};
