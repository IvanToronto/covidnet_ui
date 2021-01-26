import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import avator from '../../assets/images/avator.png';
import { CreateAnalysisTypes } from "../../context/actions/types";
import { AppContext } from "../../context/context";
import RightArrowButton from "../../pages/CreateAnalysisPage/RightArrowButton";
import CreateAnalysisService, { StudyInstance } from "../../services/CreateAnalysisService";
import SelectedStudyDetail from "./SelectedStudyDetail";
import SelectionStudy from "./SelectionStudy";


interface CreateAnalysisDetailProps {
  setIsExpanded: Dispatch<SetStateAction<boolean>>,
  submitAnalysis: (XrayModel: string | void, CTModel: string | void) => (() => void)
}

const CreateAnalysisDetail: React.FC<CreateAnalysisDetailProps> = (props) => {
  const { state: { dcmImages, createAnalysis }, dispatch } = useContext(AppContext);
  const { selectedStudyUIDs } = createAnalysis;

  const [XrayModel, setXrayModel] = useState('pl-covidnet');
  const [CTModel, setCTModel] = useState('pl-ct-covidnet');
  const [useXray, setUseXray] = useState(true);

  useEffect(() => {
    const patientInfo = CreateAnalysisService.extractPatientPersonalInfo(dcmImages[0])
    dispatch({
      type: CreateAnalysisTypes.Update_patient_personal_info,
      payload: {
        ...patientInfo
      }
    })
  }, [dcmImages, dispatch])

  const studyInstances: StudyInstance[] = CreateAnalysisService.extractStudyInstances(dcmImages);
  const numOfSelectedImages: number = CreateAnalysisService.findTotalImages(selectedStudyUIDs);

  const { patientName, patientID, patientBirthdate, patientGender } = createAnalysis;
  const { submitAnalysis } = props;

  const handleXrayChange = (event: any) => {
    setXrayModel(event.target.value);
    console.log(event.target.value);
    console.log("Hello World XRAY!");
  }

  const handleCTChange = (event: any) => { //fix "any" typing here
    setCTModel(event.target.value);
    console.log("Hello World CT!");
  }

  const setModelType = () => {
    setUseXray(!useXray);
  }

  const XrayDropdown = <form>
                <label htmlFor="modelSelection"> Please select a model
                  <select value={XrayModel} onChange={handleXrayChange} name="modelSelection" required> 
                  {/* //needed "this" here? why? how does it work in javascript? */}
                    <option value="pl-covidnet">COVID-Net</option>
                    <option value="pl-covidnet-two">COVID-Net 2</option>
                  </select>
                </label>
              </form>;

  const CTDropdown = <form>
                <label htmlFor="modelSelection"> Please select a model
                  <select value={CTModel} onChange={handleCTChange} name="modelSelection" required>
                    <option value="pl-ct-covidnet">CT COVID-Net</option>
                    <option value="pl-ct-covidnet-two">CT COVID-Net 2</option>
                  </select>
                </label>
              </form>;
  
  return (
    <React.Fragment>
      <div className="detail-wrapper">
        <div className="detail-top-wrapper">
          <div className="detail-top-left">
            <h1>Create a new predictive analysis</h1>
            <p>Select at least one image series below and select the "Analyze" button to receive predictions per image.</p>
            <div className="detail-patient">
              <div>
                <img src={avator} alt="avator" width="100px" height="100px"></img>
              </div>
              <div className="detail-patient-title">
                <h2>{patientName}</h2>
                <p>MRN#{patientID}</p>
              </div>
              <div className="detail-patient-name-age">
                <div className="detail-patient-name-age-title">
                  <h3>Patient Age</h3>
                  <h3>Patient Birthdate</h3>
                  <h3>Patient Gender</h3>
                </div>
                <div className="detail-patient-name-age-info">
                  <p> {CreateAnalysisService.calculatePatientAge(patientBirthdate)}y </p>
                  <p> {patientBirthdate} </p>
                  <p> {patientGender} </p>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-top-right">
            <div className="detail-top-right-box">
              <div className="numberCircle">{numOfSelectedImages}</div>
              <h3>Series selected</h3>
              <a onClick={() => props.setIsExpanded(true)}>(More details)</a>
              <RightArrowButton click={submitAnalysis} XrayModel={XrayModel} CTModel={CTModel}>
                Analyze
              </RightArrowButton>
              {useXray && XrayDropdown}
              {!useXray && CTDropdown}
            </div>
          </div>
        </div>
        <div className="detail-bottom-wrapper">
          <div className="detail-select-studies">
            {studyInstances.map((study: StudyInstance, i) => {
              study.setModelType = setModelType;
              return <SelectionStudy key={i} {...study}></SelectionStudy>;
            })}
          </div>
          <SelectedStudyDetail></SelectedStudyDetail>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CreateAnalysisDetail;


/*
swift -A http://127.0.0.1:8080/auth/v1.0 -U chris:chris1234 -K testing upload users
/Users/jbernal/PACS/BCH/5296709-VITO.DANIEL/CT.Abdomen.thru.Symphysis.w..Contrast-20120602-1.2.840.113619.2.55.3.51037702.990.1338550396.599/COR.STD-20120602-1.2.840.113619.2.80.45556984.23031.1338680717.1.4.1/00020-1.2.840.113619.2.80.45556984.23031.1338680724.22.dcm --object-name "SERVICES/PACS/BCH/5296709-VITO.DANIEL/CT.Abdomen.thru.Symphysis.w..Contrast-20120602-1.2.840.113619.2.55.3.51037702.990.1338550396.599/COR.STD-20120602-1.2.840.113619.2.80.45556984.23031.1338680717.1.4.1/00020-1.2.840.113619.2.80.45556984.23031.1338680724.22.dcm"
*/