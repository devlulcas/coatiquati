export function welcomeMail(props: { username: string }) {
	return `
  <table
        role="presentation"
        class="main"
        style="
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          background: #ffffff;
          border-radius: 3px;
          width: 100%;
        "
        width="100%"
      >
        <!-- START MAIN CONTENT AREA -->
        <tr>
          <td
            class="wrapper"
            style="
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top;
              box-sizing: border-box;
              padding: 20px;
            "
            valign="top"
          >
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              style="
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
              "
              width="100%"
            >
              <tr>
                <td
                  style="font-family: sans-serif; font-size: 14px; vertical-align: top"
                  valign="top"
                >
                  <p
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 15px;
                    "
                  >
                    Olá ${props.username}
                  </p>
                  <p
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 15px;
                    "
                  >
                    Bem vindo de volta ao Coati!
                  </p>
                  <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="btn btn-primary"
                    style="
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      box-sizing: border-box;
                      width: 100%;
                    "
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            vertical-align: top;
                            padding-bottom: 15px;
                          "
                          valign="top"
                        >
                          <table
                            role="presentation"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              border-collapse: separate;
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              width: auto;
                            "
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    font-family: sans-serif;
                                    font-size: 14px;
                                    vertical-align: top;
                                    border-radius: 5px;
                                    text-align: center;
                                    background-color: #6b21a8;
                                  "
                                  valign="top"
                                  align="center"
                                  bgcolor="#6b21a8"
                                >
                                  <a
                                    href="${'http://localhost:5173/'}"
                                    target="_blank"
                                    style="
                                      border: solid 1px #6b21a8;
                                      border-radius: 5px;
                                      box-sizing: border-box;
                                      cursor: pointer;
                                      display: inline-block;
                                      font-size: 14px;
                                      font-weight: bold;
                                      margin: 0;
                                      padding: 12px 25px;
                                      text-decoration: none;
                                      text-transform: capitalize;
                                      background-color: #6b21a8;
                                      border-color: #6b21a8;
                                      color: #ffffff;
                                    "
                                    >Acesse o site</a
                                  >
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 15px;
                    "
                  >
                    Aprenda ensinando e ensine aprendendo.
                  </p>
                  <p
                    style="
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 15px;
                    "
                  >
                    Atenciosamente, Coati.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- END MAIN CONTENT AREA -->
      </table>
      <!-- END CENTERED WHITE CONTAINER -->
`;
}
