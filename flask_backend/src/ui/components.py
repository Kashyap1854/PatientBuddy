from tkinter import Tk, Label, Entry, Button, Text, Scrollbar, END

class MedicalAIApp:
    def __init__(self, master):
        self.master = master
        master.title("Medical AI Assistant")

        self.label = Label(master, text="Enter Medical Data:")
        self.label.pack()

        self.input_text = Text(master, height=10, width=50)
        self.input_text.pack()

        self.extract_button = Button(master, text="Extract Parameters", command=self.extract_parameters)
        self.extract_button.pack()

        self.result_label = Label(master, text="Results:")
        self.result_label.pack()

        self.result_text = Text(master, height=10, width=50)
        self.result_text.pack()

        self.scrollbar = Scrollbar(master, command=self.result_text.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.result_text.config(yscrollcommand=self.scrollbar.set)

    def extract_parameters(self):
        input_data = self.input_text.get("1.0", END)
        # Placeholder for extraction logic
        extracted_data = "Extracted data will be displayed here."
        self.result_text.delete("1.0", END)
        self.result_text.insert(END, extracted_data)

if __name__ == "__main__":
    root = Tk()
    app = MedicalAIApp(root)
    root.mainloop()