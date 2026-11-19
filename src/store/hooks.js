/**
 * @file src/store/hooks.js
 * @description Typed Redux hooks for dispatching actions and selecting state
 */
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

