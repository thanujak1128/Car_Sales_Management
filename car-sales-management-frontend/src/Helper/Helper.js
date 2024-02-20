export const getPurchaseStatus = (status) => {
    switch (status) {
        case "A":
            return "Available";
        case "S":
            return "Sold";
        default:
            return "";
    }
}

export const getStatus = (status) => {
    switch (status) {
        case "A":
            return "Approved";
        case "R":
            return "Rejected";
        case "I":
            return "Initiated";
        case "P":
            return "Paid";
        case "S":
            return "Sold";
        case "C":
            return "Cancelled";
        default:
            return "";
    }
}

export const getUserRole = (value) => {
    switch (value) {
        case "B":
            return "(Buyer)";
        case "S":
            return "(Seller)";
        default:
            return "";
    }
}

export const formatDate = (date) => {
    const utcDateTime = new Date(date);
    const etDateTime = new Date(utcDateTime.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    };
    return etDateTime.toLocaleDateString("en-US", options);
}