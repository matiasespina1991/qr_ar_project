import CircularProgress from '@material-ui/core/CircularProgress';

export default function CircularProgressLoader() {
    return(
        <>
        <div className='loading-screen--wrapper'>
            <CircularProgress color="primary" />
        </div>
        <style jsx>{`
        .loading-screen--wrapper {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        `}</style>
        </>
    ) 
}