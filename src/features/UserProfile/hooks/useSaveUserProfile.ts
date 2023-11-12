import {AxiosError} from 'axios';
import {useMutation} from '@tanstack/react-query';
import {SaveUserProfile} from '../services/userProfile-service';
import {SaveProfileResponse} from '../types/userProfile';

const useSaveUserProfile = () =>
  useMutation<SaveProfileResponse, AxiosError, User>({
    mutationFn: (user: User) => SaveUserProfile(user),
  });

export default useSaveUserProfile;
