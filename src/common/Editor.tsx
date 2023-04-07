import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';
import {useEffect, useRef} from "react";

interface IEditor {
    htmlStr: string;
    setHtmlStr: React.Dispatch<React.SetStateAction<string>>;
}

const TuiEditor = ({ htmlStr, setHtmlStr }:IEditor) => {
    const toolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr'],
        ['ul', 'ol', 'task'],
        ['table', 'link'],
        // ['image'],
        ['code'],
        ['scrollSync'],
    ];
    const editorRef = useRef<Editor>(null);

    const onChangeEditor = () => {
        if(editorRef.current) {
            setHtmlStr(editorRef.current.getInstance().getHTML());
        }
    }

    useEffect(() => {
        if(editorRef.current) {
            // 기존 이미지 업로드 기능 제거
            editorRef.current.getInstance().removeHook('addImageBlobHook');
            // 이미지 서버로 데이터를 전달하는 기능 추가
            editorRef.current.getInstance().addHook('addImageBlobHook', (blob: string | Blob, callback: (arg0: any, arg1: string) => void) => {
                (async () => {
                    const formData = new FormData();
                    // formData.append("multipartFiles", blob);

                    // const res = await axios.post('http://localhost:8080/uploadImage', formData);

                    callback(blob, "input alt text");
                })();

                return false;
            });
        }
    }, [])


    return (
        <>
            {editorRef && (
                <Editor
                    ref={editorRef}
                    initialValue={' '} // 글 수정 시 사용
                    initialEditType="wysiwyg" // wysiwyg & markdown
                    previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // tab, vertical
                    hideModeSwitch={true}
                    height="100%"
                    minHeight={'200px'}
                    // theme={''} // '' & 'dark'
                    // usageStatistics={false}
                    // toolbarItems={toolbarItems}
                    useCommandShortcut={true}
                    plugins={[colorSyntax]}
                    onChange={onChangeEditor}
                    placeholder={'업무내용을 입력해주세요.'}
                    autofocus={false}
                />
            )}
        </>
    );
};

export default TuiEditor;