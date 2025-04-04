import styles from './Homepage.module.css'; 

export default function Homepage() {
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Welcome admin</h1>
            </div>
        </>
    );
}