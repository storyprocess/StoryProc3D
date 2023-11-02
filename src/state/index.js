import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
    showTour: false,
    selectedButton: null,
    dimBg: false,
    playBgMusic: false,
    showUC: false,
    fetched: false,
    useCase:0,
    playAndPause:true,
    IsButtonContainer:true,
    IsAutoPlay:false,
    IsTourOpen:false,
    IsModelOpen:false,
    modelUseCaseId:0,
    UCTourId:0,
    MfToEdgeCity:true,
    UmToDigitalCity:true,
    IsLoading:true,
    IsHomeButtonClick:false,
    IsWelcomVo:true,
    IsMuted:false,
    IsMuted:false,
    ApplicationDB:'factory',
    IsModelLoaded:true,
		audioVO1: [],
		audioPathVO1: [],
		use_case_list: [],
		mapped_use_case: null,
});

export {setGlobalState, useGlobalState};