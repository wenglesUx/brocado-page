import styles from './styles/Desktop.module.css';

export default function Footer() {


  return (
    <footer className={styles.footer}>
      <div className={`${styles.footer__container} ${styles.container}`}>
        <p className={styles.footer__copyright}>
          Brocado Food - Todos os direitos reservados        
        </p>
       
      </div>
    </footer>
  );
}
