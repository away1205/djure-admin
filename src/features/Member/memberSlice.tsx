import { createSlice } from '@reduxjs/toolkit';
import { MemberType } from '../../shared/MemberType';
import { AppDispatch } from '../../store';
import {
  createMemberService,
  deleteMemberService,
  filterMemberService,
  getAllMemberService,
  updateMemberService,
} from '../../services/memberService';

type InitialStateType = {
  isLoading: boolean;
  memberList: MemberType[];
  memberData: MemberType;
  error: string;
};

const initialState: InitialStateType = {
  isLoading: false,
  memberList: [],
  memberData: {
    id: 0,
    fullname: '',
    generation: 0,
    phoneNumber: '',
    email: '',
    address: '',
    occupation: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    bloodType: '',
    inGroup: false,
    createdBy: 0,
  },
  error: '',
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    loadingMember(state) {
      state.isLoading = true;
      state.error = '';
    },
    loadedMemberList(state, action) {
      state.isLoading = false;
      state.error = '';
      state.memberList = action.payload;
    },
    loadedMemberData(state, action) {
      state.isLoading = false;
      state.error = '';
      state.memberData = action.payload;
    },

    createMember(state, action) {
      state.isLoading = false;
      state.error = '';
      state.memberList.push(action.payload);
    },
    deleteMember(state, action) {
      state.isLoading = false;
      state.error = '';
      state.memberList = state.memberList.filter(
        (member) => member.id !== action.payload
      );
    },
    updateMember(state, action) {
      state.isLoading = false;
      state.error = '';
      state.memberData = action.payload; // Put method
    },

    rejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export function loadedMember() {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    getAllMemberService().then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/loadedMemberList', payload: data });
    });
  };
}

export function loadedMemberData(id: number) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    filterMemberService('id', id).then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/loadedMemberData', payload: data[0] });
    });
  };
}

export function filterMember(filterBy: string, filterValue: string | number) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    filterMemberService(filterBy, filterValue).then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/loadedMemberList', payload: data });
    });
  };
}

export function createMember(newMember: MemberType) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    createMemberService(newMember).then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/createMember', payload: data });
    });
  };
}

export function updateMember(memberID: number, newMember: MemberType) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    updateMemberService(memberID, newMember).then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/updateMember', payload: data });
    });
  };
}

export function deleteMemberList(memberID: number) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'member/loadingMember' });

    deleteMemberService(memberID).then((data) => {
      if (data?.code) {
        dispatch({ type: 'member/rejected', payload: data.message });

        return;
      }

      dispatch({ type: 'member/deleteMember', payload: memberID });
    });
  };
}

export default memberSlice.reducer;
