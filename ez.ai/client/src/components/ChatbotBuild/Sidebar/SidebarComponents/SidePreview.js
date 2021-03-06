import React, { useCallback, useState, useEffect } from "react";
import "./SidePreview.css";
import Clock from "react-live-clock";
import { useSelector } from "react-redux";
import GoogleMapPresenter from "../../api/GoogleMapPresenter";

const SidePreview = (props) => {
  const dayList = ["일", "월", "화", "수", "목", "금", "토"];
  let today = new Date();
  let dd = dayList[today.getDay()];
  let theHours = today.getHours();
  let noon = "오전";
  if (theHours > 12) {
    theHours = theHours - 12;
    noon = "오후";
  }

  const { currentChatbot } = useSelector((state) => state.chatbot);
  const [message, setMessage] = useState("");
  const [keyboard, setKeyboard] = useState("");
  const [fixedMenu, setFixedMenu] = useState([]);
  const [persistentCount, setPersistenCount] = useState([]);

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  //미리보기 => 사용자가 키워드 입력시 일치하는 키워드를 찾아서 dialogues 배열에 추가하는 방식
  const [dialogues, setDialogues] = useState([]);

  //처음 시작시 Welcome키워드에 있는 요소 먼저 나타남
  useEffect(() => {
    const welcomeDialogue = props.keywordObject[0];
    setDialogues(addDialogue(welcomeDialogue, 0));
  }, [props.activePlatformTab, currentChatbot, props.keywordObject]);

  const currentTime = (position) => {
    return (
      <div className={position == "inner" ? "nowtime_inner" : "nowtime_outer"}>
        <Clock
          format={noon + " " + theHours + ":mm"}
          ticking={true}
          timezone={"Asia/Seoul"}
        />
      </div>
    );
  };

  //전달받은 키워드 안의 요소들의 타입을 구별후 배열 return
  const addDialogue = (findKeyword, findIndex) => {
    const dialogues = findKeyword.contents.map((c, i) => {
      if (c.type === "text")
        return (
          <div
            className={` ${props.activePlatformTab} ${
              props.activePlatformTab
            }-text ${
              props.activePlatformTab === "platform-line" && i >= 4
                ? `linePreviewLimit`
                : `preview-receive`
            }`}
          >
            {c.content}
            {currentTime("outer")}
          </div>
        );
      else if (c.type === "list")
        return (
          <>
            {setPersistenCount(
              c.listContent.keywordLink.filter((elem) => elem !== "")
            )}
            {persistentCount.length > 4 &&
            props.activePlatformTab === "platform-line" ? null : (
              <>
                {setKeyboard(props.activePlatformTab)}
                {setFixedMenu(c.listContent.keywordLink)}
              </>
            )}
          </>
        );
      else if (c.type === "image")
        return (
          <div
            className={` ${props.activePlatformTab} ${
              props.activePlatformTab
            }-image  ${
              props.activePlatformTab === "platform-line" && i >= 4
                ? `linePreviewLimit`
                : `preview-receive`
            }`}
          >
            <div
              className="main-image-preview"
              style={{ backgroundImage: `url(${c.filepath})` || null }}
            ></div>
            {currentTime("inner")}
          </div>
        );
      else if (c.type === "audio")
        return (
          <div
            className={` ${props.activePlatformTab} ${
              props.activePlatformTab
            }-audio  ${
              props.activePlatformTab === "platform-line" && i >= 4
                ? `linePreviewLimit`
                : `preview-receive`
            }`}
          >
            <i className="fas fa-play fa-lg file-icon-preview"></i>
            <div
              className="main-audio-preview"
              style={{ backgroundImage: `url(${c.filepath})` || null }}
            ></div>
            <div>{c.content}</div>
            {currentTime("inner")}
          </div>
        );
      else if (c.type === "video")
        return (
          <div
            className={` ${props.activePlatformTab} ${
              props.activePlatformTab
            }-video  ${
              props.activePlatformTab === "platform-line" && i >= 4
                ? `linePreviewLimit`
                : `preview-receive`
            }`}
          >
            <i className="fas fa-play fa-lg file-icon-preview"></i>
            <div
              className="main-video-preview"
              style={{ backgroundImage: `url(${c.filepath})` || null }}
            ></div>
            <div>{c.content}</div>
            {currentTime("inner")}
          </div>
        );
      else if (c.type === "location")
        return (
          <div
            className={` ${props.activePlatformTab} ${
              props.activePlatformTab
            }-location  ${
              props.activePlatformTab === "platform-line" && i >= 4
                ? `linePreviewLimit`
                : `preview-receive`
            }`}
          >
            <GoogleMapPresenter
              keywordObject={props.keywordObject}
              setKeywordObject={props.setKeywordObject}
              index={findIndex}
              now={i}
            ></GoogleMapPresenter>
            {currentTime("inner")}
          </div>
        );
      else if (c.type === "btn_template") {
        return (
          <>
            {props.activePlatformTab === "platform-telegram" ? (
              <div className="buttonsbox-telegram" key={c.content + i}>
                {/* 이미지 */}
                {c.content.thumbnailImageUrl !== "" ? (
                  <div className="preview-receive buttons-thumbnail-telegram">
                    <img
                      className="main-buttons-thumbnail-image"
                      src={c.content.thumbnailImageUrl}
                      style={
                        c.content.imageSize === "cover"
                          ? { width: "100%" }
                          : { height: "100%" }
                      }
                    />
                    {currentTime("inner")}
                  </div>
                ) : null}
                {c.content.title !== "" ? (
                  <div className="preview-receive buttons-title-telegram">
                    {c.content.title}
                    {currentTime("outer")}
                  </div>
                ) : null}
                <div className="preview-receive buttons-text-telegram">
                  {c.content.text !== "" ? c.content.text : "text"}
                  {currentTime("outer")}
                </div>
                {setKeyboard("platform-telegram-buttons")}
                {setFixedMenu(c.content.actions)}
              </div>
            ) : (
              <div
                className={` ${props.activePlatformTab} ${
                  props.activePlatformTab
                }-btn_template  ${
                  props.activePlatformTab === "platform-line" && i >= 4
                    ? `linePreviewLimit`
                    : `preview-receive`
                }`}
              >
                <div className={"buttonsbox-line"} key={c.content + i}>
                  {/* 버튼 템플릿 이미지 없을 경우 이미지 영역 보이지 않음 */}
                  {c.content.thumbnailImageUrl !== "" ? (
                    <div
                      className="buttons-thumbnail-line"
                      style={{
                        backgroundColor: c.content.imageBackgroundColor,
                      }}
                    >
                      <img
                        className="main-buttons-thumbnail-image"
                        src={c.content.thumbnailImageUrl}
                        style={
                          c.content.imageSize === "cover"
                            ? { width: "100%" }
                            : { height: "100%" }
                        }
                      />
                    </div>
                  ) : null}
                  <div className="main-buttons-contents">
                    {c.content.title !== "" ? (
                      <div className="buttons-title-line">
                        {c.content.title}
                      </div>
                    ) : null}
                    <div className="buttons-text-line">
                      {c.content.text !== "" ? c.content.text : "text"}
                    </div>
                    <div className="main-buttons-actions">
                      <div className="space-top"></div>
                      {c.content.actions.map((act, index) => (
                        <div
                          className="main-buttons-action"
                          onClick={() =>
                            act.type === "uri"
                              ? window.open(act.uri)
                              : moveKeyword(act.data)
                          }
                        >
                          {act.label !== ""
                            ? act.label
                            : "(button" + (index + 1) + ")"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {currentTime("outer")}
              </div>
            )}
          </>
        );
      }
    });
    return dialogues;
  };

  const moveKeyword = useCallback(
    (i) => {
      setKeyboard("");
      setFixedMenu([]);
      setDialogues((prev) => [...prev, sendMessage(i)]);
    },
    [
      dialogues,
      message,
      currentChatbot,
      props.activePlatformTab,
      props.keywordObject,
    ]
  );

  const onSubmitPreview = useCallback(
    (e) => {
      e.preventDefault();
      //sendMessage 함수로부터 return받은 배열을  dialogues배열에 추가
      setDialogues((prev) => [...prev, sendMessage(message)]);
      setMessage("");
    },
    [message, props.activePlatformTab]
  );

  //일치하는 키워드가 있으면 키워드의 내용을 addDialogue함수로 전달
  const sendMessage = useCallback(
    (input) => {
      const findKeyword = props.keywordObject.find((k) => k.keyword === input);
      const findIndex = props.keywordObject.findIndex(
        (k) => k.keyword === input
      );
      if (!findKeyword)
        return (
          <>
            <div className="preview-send">
              {input}
              <div className="nowtime">{currentTime("outer")}</div>
            </div>
            <div
              className={`preview-receive ${props.activePlatformTab} ${props.activePlatformTab}-notfound`}
            >
              다시 한번 입력해주세요
              <div className="nowtime">{currentTime("outer")}</div>
            </div>
          </>
        );
      return (
        <>
          <div
            className={`preview-send  ${props.activePlatformTab} ${props.activePlatformTab}-send`}
          >
            {input}
            <div className="nowtime">{currentTime("outer")}</div>
          </div>
          {/* 키워드 전달 후 일치하는 요소들의 배열을 return받음 */}
          {addDialogue(findKeyword, findIndex)}
        </>
      );
    },
    [
      message,
      currentChatbot,
      dialogues,
      props.activePlatformTab,
      props.keywordObject,
    ]
  );
  return (
    <>
      {props.activePlatformTab == "platform-line" ? (
        <div className="preview-container side-line">
          <div className="preview-header"></div>
          <div className="preview-contents">
            <div class="datetime">
              <Clock
                format={"MM월 DD일 (" + dd + ")"}
                ticking={true}
                timezone={"Asia/Seoul"}
              />
            </div>
            {dialogues.map((dialogue) => {
              return dialogue;
            })}
          </div>
          <div className="preview-footer line-preview-footer">
            <div className="preview-footer-icons">
              <div className="preview-footer-icon">
                <i className="fas fa-plus"></i>
              </div>
              <div className="preview-footer-icon">
                <i className="fas fa-camera"></i>
              </div>
              <div className="preview-footer-icon">
                <i className="far fa-image"></i>
              </div>
            </div>
            <div class="preview-input input-line">
              <form onSubmit={onSubmitPreview}>
                <input
                  type="text"
                  placeholder="메세지"
                  value={message}
                  onChange={onChangeMessage}
                />
              </form>
              <i className="far fa-smile"></i>
            </div>
            <div className="preview-footer-icon-right">
              <div className="preview-footer-icon">
                <i className="fas fa-microphone"></i>
              </div>
            </div>
          </div>
          {keyboard === "platform-line" ? (
            <div className="preview-keyboard">
              {fixedMenu.map((i) => {
                if (i === "") {
                } else {
                  return (
                    <div
                      className={`preview-button ${props.activePlatformTab}-list-elem`}
                      onClick={() => moveKeyword(i)}
                    >
                      {i}
                    </div>
                  );
                }
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {props.activePlatformTab == "platform-telegram" ? (
        <div className="preview-container side-telegram">
          <div className="preview-header"></div>
          <div className="preview-contents">
            <div class="datetime">
              <Clock
                format={"MM월 DD일"}
                ticking={true}
                timezone={"Asia/Seoul"}
              />
            </div>
            <div className="preview-send">
              /start
              <div className="nowtime">{currentTime("outer")}</div>
            </div>
            {dialogues.map((dialogue) => {
              return dialogue;
            })}
          </div>
          <div className="preview-footer">
            <div className="preview-footer-imogi">
              <i className="far fa-smile"></i>
            </div>
            <div class="preview-input input-telegram">
              <form onSubmit={onSubmitPreview}>
                <input
                  type="text"
                  placeholder="메세지"
                  value={message}
                  onChange={onChangeMessage}
                />
              </form>
            </div>
            <div className="preview-footer-icons">
              <div className="preview-footer-icon">
                <i className="far fa-keyboard"></i>
              </div>
              <div className="preview-footer-icon">
                <i className="fas fa-paperclip"></i>
              </div>
              <div className="preview-footer-icon">
                <i className="fas fa-microphone"></i>
              </div>
            </div>
          </div>
          {keyboard === "platform-telegram" ? (
            <div className="preview-keyboard">
              {fixedMenu.map((i) => {
                if (i === "") {
                } else {
                  return (
                    <div
                      className={`preview-button ${props.activePlatformTab}-list-elem`}
                      onClick={() => moveKeyword(i)}
                    >
                      {i}
                    </div>
                  );
                }
              })}
            </div>
          ) : keyboard === "platform-telegram-buttons" ? (
            <div className="preview-keyboard">
              {fixedMenu.map((act, index) => (
                <div
                  className={`preview-button ${props.activePlatformTab}-list-elem`}
                  onClick={() =>
                    act.type === "uri"
                      ? window.open(act.uri)
                      : moveKeyword(act.data)
                  }
                >
                  {act.label !== "" ? act.label : "(button" + (index + 1) + ")"}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default SidePreview;
