namespace DNA_API.Models
{
    public class Response<T1>
    {

        public Response(T1 data, bool success, string message)
        {
            this.Data = data;
            this.Success = success;
            this.Message = message;
        }

        public Response()
        {
            
        }

        public T1 Data { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}