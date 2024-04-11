export const getTransactionsService = async (
  client: any,
  link: string,
  fromFormat: string,
  toFormat: string,
) => {
  try {
    const response = await client.transactions.retrieve(link, fromFormat, {
      dateTo: toFormat,
    });
    return {
      error: false,
      transactions: response,
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};

export const getIncomesService = async (client: any, link: string) => {
  try {
    const response = await client.incomes.retrieve(link);
    return {
      error: false,
      incomes: response,
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};

export const getAccountLink = async (client: any, link: string) => {
  try {
    const response = await client.accounts.retrieve(link);
    return {
      error: false,
      accounts: response,
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};

export const getOwnerService = async (client: any, link: string) => {
  try {
    const response = await client.owners.retrieve(link);
    return {
      error: false,
      owner: response,
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};

export const getExpensesService = async (client: any, link: string) => {
  try {
    const response = await client.recurringExpense.retrieve(link);
    return {
      error: false,
      expenses: response,
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};
