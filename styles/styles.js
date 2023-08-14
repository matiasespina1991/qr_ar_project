import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  dropzone: {
    color: '#7a7a7a',
    border: '2.5px dashed',
    height: '100%',
    margin: '0rem 2rem 1rem 2rem',
    padding: '16px',
    textAlign: 'center',
    display: 'flex',
    borderColor: '#C7C7C7',
    backgroundColor: '#F0F0F0',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialogPaper: {
    height: '100%',
    maxHeight: '30rem',
    width: '100%',
    maxWidth: '60rem',
  },
}));
