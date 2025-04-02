import styles from "./Login.module.css";
import LoginForm from "./Form";

export default function LoginComp() {
    return (
        <div className={styles.login}>
            <LoginForm />
        </div>
    );
}
