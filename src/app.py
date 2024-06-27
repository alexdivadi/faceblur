import streamlit as st
import numpy as np
from face_detection import detect_img, blur_faces_img
from pathlib import Path
    
    
def main():
    st.set_page_config(page_title="FaceBlur",page_icon=":frame_with_picture:")
    st.title('FaceBlur')
    st.subheader("Upload an image: ")
    img=st.file_uploader("Upload the image you would like to blur",type=["png","jpg","jpeg","webp"])

    if img is not None:
        ext = Path(img.name).suffix
        file_bytes = np.asarray(bytearray(img.read()), dtype=np.uint8)

        blurred_img = None
        blur_amt: int = st.slider("Blur Amount",min_value=4,max_value=28,value=16,step=4)
        thresh: float = st.slider("Detection Threshold",min_value=0.65,max_value=0.95,value=0.8,step=0.05)
        
        col1, col2 = st.columns( [0.5, 0.5])
        with col1:
            st.markdown('<p style="text-align: center;">Original</p>',unsafe_allow_html=True)
            st.image(img) 

        with col2:
            st.markdown('<p style="text-align: center;">Blurred</p>',unsafe_allow_html=True)
            try:
                faces = detect_img(file_bytes, thresh=thresh)
                if faces:
                    blurred_img = blur_faces_img(file_bytes, faces, blur_amt, ext)
                    st.image(blurred_img, channels="BGR")
                else:
                    st.warning('No human faces were detected')
                    
            except Exception as e:
                st.error('There was an issue processing that image')
                if st.button('See more'):
                    st.exception(e)

        if blurred_img is not None:
            st.subheader('Download:')
            st.download_button("Download Blurred Image", blurred_img, file_name='blurred_'+img.name, mime=img.type)
    
        


if __name__ == "__main__":
    main()
