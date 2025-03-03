export const styles = {
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  activeToast: {
    fontWeight: 800, 
    color: "white", 
    position: "fixed", 
    bottom: "10px",
    borderRadius: "18px",
    padding: "10px",
    fontSize: "20px",
    width: "400px",
    height: "100px", 
    right: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(157, 196, 242, .9)",
  },
  addToppingButton: {
    width: "215px",
    padding: "15px",
    alignSelf: "flex-end",
    backgroundColor: "limegreen",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 800,
  },
  openModal: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
  },
  modalContent: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    zIndex: 1000,
    width: "60%",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    minWidth: "500px",
  },
  modalCloseBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
  },
  startButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "limegreen",
    color: "white",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editContainer: {
    height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px"
  },
  inputText: {
    width: "100%", 
    padding: "8px", 
    marginBottom: "10px", 
    height: "40px", 
    fontSize: "20px" 
  },
  actions: {
    width: "600px",
    height: "35px",
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px"
  },
  actionsProceed: {
    cursor: "pointer", 
    backgroundColor: "limegreen", 
    color: "black", 
    fontWeight: 800, 
    borderRadius: "12px", 
    width: "100px"
  },
  actionsBack: {
    cursor: "pointer", 
    backgroundColor: "grey", 
    color: "white", 
    fontWeight: 800, 
    borderRadius: "12px", 
    width: "100px"
  },
  reviewContainer: {
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px"
  },
  reviewTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  reviewRowCol: {
    padding: "8px", 
    border: "2px solid black"
  },
  tableContainer: {
    width: "100%", 
    marginTop: "20px", 
    border: "1px solid black"
  },
  tableHeader: {
    border: "1px solid black", 
    backgroundColor: "grey", 
    color: "white", 
    fontWeight: 800
  },
  tableRow: {
    border: "1px solid black", 
    textAlign: "left", 
    padding: "5px", 
    backgroundColor: "rgb(1, 1, 1, 0.05"
  },
  tableEditBtn: {
    width: "45%" , 
    backgroundColor: "grey", 
    color: "white", 
    padding: "5px", 
    cursor: "pointer"
  },
  tableDeleteBtn: {
    width: "45%", 
    backgroundColor: "red", 
    color: "white", 
    padding: "5px", 
    marginLeft: "5px", 
    cursor: "pointer"
  },
  roleBadge: {
    backgroundColor: "black", 
    padding: "5px", 
    color: "white", 
    fontWeight: 800, 
    borderRadius: "20px"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  chartContainer: {
    marginTop: "40px", 
    width: "100%", 
    height: "300px" 
  },
  welcomeMessage: {
    fontSize: "30px", 
    fontWeight: 800, 
    fontFamily: "sans-serif"
  },
  statsContainer: {
    marginTop: "40px"
  }
};
