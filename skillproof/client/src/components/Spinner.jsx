export default function Spinner({ size = 32, text = '' }) {
    return (
        <div className="spinner-wrapper">
            <div className="spinner" style={{ width: size, height: size }} />
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );
}
