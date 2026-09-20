class parent {
    void display() { System.out.println("parent display");}

    void display(int x)
    {
        System.out.println("parent display(int):"+x);
    }
    void show()
    {
        System.out.println("parent show");
    }
}
 
    class child extends parent
    {
        @Override
        void show()
        {
            System.out.println("");
        }

    }
    public class harsha
    {
        public static void main(String args[])
        {
             parent p= new parent();
             p.display();
             p.display(10);
             parent obj=new child();
             obj.show();
        }
    }
